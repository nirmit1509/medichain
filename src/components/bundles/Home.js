import axios from 'axios';
import React from 'react';
import '../../css/Home.css';
import MaterialTable from 'material-table';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Tooltip from '@material-ui/core/Tooltip';
import { Button, TextField, MenuItem, CircularProgress } from '@material-ui/core';
import ShareIcon from '@material-ui/icons/Share';
import EditIcon from '@material-ui/icons/Edit';
import { headerCSS, cellCSS, permissionString, SuccessAlert, FailureAlert } from '../../constants';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

const pinataApiKey = 'e5f5ef5b5b1e5ca0f85e';
const pinataSecretApiKey = '46e3803b4ec44e00ee3bec0b3df52587b99674e8f35eabab19f506adca248001';

function Home({ web3, account, contract, records }) {

  const [ address, setAddress ] = React.useState('');
  const [ permission, setPermission ] = React.useState('1');
  const [ open, setOpen ] = React.useState(false);
  const [ record, setRecord ] = React.useState({});

  const [ shareModal, setShareModal ] = React.useState(false);
  const [ editModal, setEditModal ] = React.useState(false);

  // const [hash, setHash] = React.useState('');
  const [ file, setFile ] = React.useState();
  const [ uploading, setUploading ] = React.useState(false);

  const handleClickOpen = () => { setOpen(true); };

  const handleClose = () => {
    setOpen(false);
    setAddress('');
    setFile(null)
    setPermission('1');
    setShareModal(false);
    setEditModal(false);
    setRecord({});
  };

  const openShareModal = (e, record) => {
    handleClickOpen();
    setShareModal(true);
    setRecord(record);
  }

  const openEditModal = (e, record) => {
    handleClickOpen();
    setEditModal(true);
    setRecord(record);
  }

  const columns = [
    { title: "ID", field: "recordId", headerStyle: headerCSS, cellStyle: cellCSS },
    { title: "Patient_Name", field: "fileName", headerStyle: headerCSS, cellStyle: cellCSS },
    {
      title: "Owner", field: "owner", headerStyle: headerCSS, cellStyle: cellCSS,
      render: row =>
        <Tooltip title={row.owner} placement="bottom-end">
          <div>{`${row.owner.slice(0, -25)}....${row.owner.slice(37, 42)}`}</div>
        </Tooltip>,
    },
    {
      title: "View", field: "ipfsHash", headerStyle: headerCSS, cellStyle: cellCSS,
      render: row =>
        row.permission === '1' || row.permission === '2'
          ?
          <Tooltip title={row.ipfsHash} placement="bottom-end">
            <FileCopyIcon
              onClick={() => window.open(`https://ipfs.io/ipfs/${row.ipfsHash}`, '_blank')}
            />
          </Tooltip>
          :
          <FileCopyIcon
            onClick={() => FailureAlert('Not Authorized to View Document !!')}
          />
    },
    {
      title: "Your_Permission", field: "permission", headerStyle: headerCSS, cellStyle: cellCSS,
      render: row => <span>{permissionString[ parseInt(row.permission) ]}</span>
    },
    {
      headerStyle: headerCSS, cellStyle: cellCSS,
      render: row =>
        <div>
          {row.permission === '2' ?
            <Button
              variant="contained"
              color="primary"
              style={{ backgroundColor: '#2f8aad' }}
              onClick={e => openShareModal(e, row)}
              startIcon={<ShareIcon />}
            > Share</Button>
            :
            <Button
              variant="contained" color="secondary"
              style={{ cursor: 'not-allowed' }}
              startIcon={<ShareIcon />}
              disabled
            > Share</Button>
          }
        </div>
    },
    {
      headerStyle: headerCSS, cellStyle: cellCSS,
      render: row =>
        <div>
          {row.permission === '2' ?
            <Button
              variant="contained"
              color="primary"
              style={{ backgroundColor: 'green' }}
              startIcon={<EditIcon />}
              onClick={e => openEditModal(e, row)}
            > Edit</Button>
            :
            <Button
              variant="contained" color="secondary"
              style={{ cursor: 'not-allowed' }}
              startIcon={<EditIcon />}
              disabled
            > Edit</Button>
          }
        </div>
    },
  ]

  const grantPermission = (e) => {
    e.preventDefault();
    if (!address) { FailureAlert('Enter Ethereum Address to continue...'); return; }
    if (!record.recordId) { FailureAlert('Unable to fetch record to share...'); return; }
    contract.methods.changePermission(record.recordId, address, parseInt(permission))
      .send({ from: account }, (error, transactionHash) => {
        console.log("transaction hash is ", transactionHash);
        SuccessAlert("Record Shared Successful...")
        handleClose()
      })
  }

  const editFile = async (e) => {
    e.preventDefault();
    if (!file) { FailureAlert('Upload a file to continue...'); return; }
    if (!record.recordId) { FailureAlert('Unable to fetch record to share...'); return; }
    setUploading(true)
    setFile(file)
    console.log(file)
    const formData = new FormData();
    formData.append("file", file);

    const resFile = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data: formData,
      headers: {
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataSecretApiKey,
        "Content-Type": "multipart/form-data"
      },
    });
    console.log(resFile)
    contract.methods.editFile(record.recordId, resFile.data.IpfsHash)
      .send({ from: account }, (error, transactionHash) => {
        console.log("transaction hash is ", transactionHash);
        SuccessAlert('File Uploaded Successfully...')
        setUploading(false);
        handleClose()
        window.location.reload()
      })
  }

  return (
    <div className="home">
      <MaterialTable
        title="All Medical Records: "
        data={records}
        columns={columns}
        options={{
          search: true,
          sorting: true,
          paging: true,
          pageSizeOptions: [ 5 ],
        }}
      />

      {/* Share/Grant permission */}
      {
        shareModal
          ?
          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Share File</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To share this file with other users, enter their Ethereum Address and select permission.
              </DialogContentText>
              <TextField
                autoFocus margin="dense"
                id="name" label="Ethereum Address"
                value={address} required
                onChange={e => setAddress(e.target.value)}
                type="text" fullWidth
              />
              <br />
              <br />
              <TextField
                id="standard-select-currency" select
                label="Select" value={permission}
                onChange={e => setPermission(e.target.value)}
                helperText="Please select permission to grant"
              >
                <MenuItem value={1}> View Only </MenuItem>
                <MenuItem value={2}> Editor </MenuItem>
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button onClick={e => grantPermission(e)} color="primary">
                Share
              </Button>
            </DialogActions>
          </Dialog>
          :
          null
      }

      {/* Edit file */}
      {
        editModal
          ?
          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Change/Edit Record</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To change/edit this file, upload a new document with updated detail.
                It will be reflected to all users with access to this record.
              </DialogContentText>
              {
                !uploading
                  ?
                  <div>
                    <Button variant="contained" component="label" color="primary">
                      Upload File
                      <input type="file" hidden onChange={e => setFile(e.target.files[ 0 ])} />
                    </Button>
                    {file ? <span style={{ marginLeft: '20px' }}> {file.name} </span> : null}
                  </div>
                  :
                  <CircularProgress style={{ display: 'block', margin: 'auto' }} />
              }

            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button onClick={e => editFile(e)} color="primary">
                Upload
              </Button>
            </DialogActions>
          </Dialog>
          :
          null
      }
    </div>
  )
}

export default Home;

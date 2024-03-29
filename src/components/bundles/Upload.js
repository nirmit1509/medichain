import axios from 'axios';
import React, { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import '../../css/Upload.css';
// import pinFileToIPFS from '../../ipfs';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, CircularProgress } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { SuccessAlert, FailureAlert } from '../../constants';

const pinataApiKey = 'e5f5ef5b5b1e5ca0f85e';
const pinataSecretApiKey = '46e3803b4ec44e00ee3bec0b3df52587b99674e8f35eabab19f506adca248001';


const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25vw',
        },
    },
    dropzone: {
        '& > *': {
            width: '65vw'
        },
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
}));

function Upload({ account, contract }) {

    const classes = useStyles();

    const [ hash, setHash ] = useState('');
    const [ fileName, setFileName ] = useState('')
    const [ file, setFile ] = useState();
    const [ loading, setLoading ] = useState(false);

    const onDrop = useCallback(acceptedFiles => {
        setLoading(true)
        acceptedFiles.forEach(async (file) => {
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
            setHash(resFile.data.IpfsHash);
            setLoading(false);
            setFile(file);
            SuccessAlert('File Uploaded Successfully...');
        })
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
    // const {ref, ...rootProps} = getRootProps()

    const baseStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        paddingTop: '6%',
        borderWidth: 2,
        borderRadius: 2,
        borderColor: 'rgb(224 223 164)',
        borderStyle: 'dashed',
        backgroundColor: 'rgb(239 245 203)',
        color: '#bdbdbd',
        outline: 'none',
        width: '50vw',
        height: '25vh',
        marginTop: '2%',
        marginLeft: '5%',
        transition: 'border .24s ease-in-out'
    };
    const activeStyle = {
        borderColor: '#2196f3'
    };

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
    }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            isDragActive,
        ]
    );

    const uploadDetails = (e) => {
        e.preventDefault();
        if (!hash) { FailureAlert('Upload File to continue...'); return; }
        contract.methods.createRecord(hash, fileName)
            .send({ from: account }, (error, transactionHash) => {
                console.log("transaction hash is ", transactionHash);
                SuccessAlert("Upload Successful...")
            })
        e.target.reset();
    }

    return (
        <div className="upload">
            <br />
            <form className="upload__form" onSubmit={(e) => uploadDetails(e)}>
                <TextField
                    id="name"
                    label="Patient Name"
                    style={{ width: '35vw', margin: '8px', marginLeft: '40px' }}
                    onChange={e => { setFileName(e.target.value) }}
                    required
                />
                {
                    loading
                        ?
                        <div>
                            <CircularProgress
                                style={{ marginLeft: '350px', marginTop: '75px', marginBottom: '50px' }}
                            />
                        </div>
                        :
                        <div {...getRootProps({ style })}>
                            <input {...getInputProps()} />
                            {
                                isDragActive ?
                                    <p>Drop the files here ...</p> :
                                    <div style={{ display: 'flex', flexDirection: 'column', placeItems: 'center' }}>
                                        <p>{`Drag & drop file here, or click`}</p>
                                        <CloudUploadIcon />
                                    </div>

                            }
                        </div>
                }

                {
                    file
                        ?
                        <div>
                            <TextField
                                className={classes.root}
                                id="file"
                                label="File Uploaded"
                                value={file.name}
                                style={{ width: '55vw', margin: '8px' }}
                            />
                        </div>
                        :
                        null
                }

                <Button
                    variant="contained"
                    type="submit"
                    color="default"
                    className="upload_btn"
                    startIcon={<CloudUploadIcon />}
                >
                    Upload
                </Button>
            </form>
        </div>
    )
}

export default Upload;
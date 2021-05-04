import React from 'react';
import '../../css/Home.css';
import MaterialTable from 'material-table';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Tooltip from '@material-ui/core/Tooltip';
import {headerCSS, cellCSS, permissionString, FailureAlert} from '../../constants';


function MyRecords({ account, contract, records }) {

    const columns = [
        { title: "ID",              field: "recordId",   headerStyle: headerCSS,  cellStyle: cellCSS },
        { title: "File_Name",       field: "fileName",   headerStyle: headerCSS,  cellStyle: cellCSS },
        { title: "Owner",           field: "owner",      headerStyle: headerCSS,  cellStyle: cellCSS,
          render: row => 
            <Tooltip title={row.owner} placement="bottom-end">
                <div>{`${row.owner.slice(0, -25)}....${row.owner.slice(37, 42)}`}</div>
            </Tooltip>, 
        },
        { title: "View",            field: "ipfsHash",   headerStyle: headerCSS,  cellStyle: cellCSS,
          render: row => 
            row.permission === '1' || row.permission === '2'
            ?
            <Tooltip title={row.ipfsHash} placement="bottom-end">
                <FileCopyIcon 
                    onClick={()=> window.open(`https://ipfs.io/ipfs/${row.ipfsHash}`, '_blank')} 
                />
            </Tooltip>
            :
            <FileCopyIcon 
                onClick={()=> FailureAlert('Not Authorized to View Document !!')} 
            />
        },
        { title: "Your_Permission", field: "permission", headerStyle: headerCSS,  cellStyle: cellCSS,
          render: row => <span>{permissionString[parseInt(row.permission)]}</span>
        },
    ]

    let data = []
    const fetchData = () => {
        records.forEach((rec, key) => {
            if(rec.owner === account) {
                data.push(rec)
            }
        })
    }
    fetchData();

    return (
        <div className="my__properties">
            <MaterialTable 
                    title="My Medical Record: "
                    data = {data}
                    columns = {columns}
                    options = {{
                        search: true,
                        sorting: true,
                        paging: true,
                        pageSizeOptions: [5],
                    }}
            />
        </div>
    )
}

export default MyRecords;
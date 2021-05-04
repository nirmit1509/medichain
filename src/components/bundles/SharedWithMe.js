import React from 'react';
import '../../css/Home.css';
import MaterialTable from 'material-table';
import Tooltip from '@material-ui/core/Tooltip';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import {headerCSS, cellCSS, FailureAlert, permissionString} from '../../constants';


function SharedWithMe({ account, contract, records }) {

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
        records.forEach((req) => {
            if((req.permission==="1" || req.permission==="2") && req.owner!==account)
                data.push(req)
        })
    }
    fetchData();

    return (
        <div className="pending__requests">
            <MaterialTable 
                title="EHR Shared with me: "
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

export default SharedWithMe;

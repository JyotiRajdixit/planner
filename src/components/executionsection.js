import React, { useState, useEffect } from "react";
import ExecutionCard from "./executioncard";
import firebaseDb from "../firebase";

const ExecutionSection = (props) => {
    var [executionObjects, setexecutionObjects] = useState({})

    useEffect(() => {
        firebaseDb.child(`execute`).on('value', snapshot => {
            if (snapshot.val != null) {
                setexecutionObjects({
                    ...snapshot.val()
                })
            }
        })
    }, [])

    const onDelete = key => {
        var myCurrentDate = new Date();
        var date = myCurrentDate.getFullYear() + '-' + (myCurrentDate.getMonth() + 1) + '-' + myCurrentDate.getDate() + ' ' + myCurrentDate.getHours() + ':' + myCurrentDate.getMinutes() + ':' + myCurrentDate.getSeconds();
        var updt = {
            creator: executionObjects[key].cname,
            type: 'Execution Done',
            title: executionObjects[key].ctitle,
            timeStamp: `${date}`
        }
        firebaseDb.child('updates').push(
            updt,
            err => {
                if (err) console.log(err)
            }
        )
        if (window.confirm('Are you sure to delete this record?')) {
            firebaseDb.child(`execute/${key}`).remove(
                err => {
                    if (err) console.log(err)
                }
            )
        }
    }

    return (
        <div className="col-lg-8">
            <nav>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item active">Under Execution</li>
                </ol>
            </nav>
            {
                Object.keys(executionObjects).reverse().filter((item) => {
                    if (props.searchTerm === "") {
                        return item;
                    }
                    else if (executionObjects[item].ctitle.toUpperCase().includes(props.searchTerm.toUpperCase().trim())) {
                        return item;
                    }
                    return null;
                }).map(id => {
                    return <div className="row" key={id}>
                        <div className="col-12">
                            <div className="card">
                                <div className="filter">
                                    <i className="icon bi bi-trash text-danger" onClick={() => { onDelete(id) }}></i>
                                </div>
                                <ExecutionCard
                                    cname= {executionObjects[id].cname}
                                    ctitle= {executionObjects[id].ctitle}
                                    cdescription= {executionObjects[id].cdescription}
                                    ititle= {executionObjects[id].ititle}
                                    idescription= {executionObjects[id].idescription}
                                />
                            </div>
                        </div>
                    </div>
                })
            }
        </div>
    );
}

export default ExecutionSection;
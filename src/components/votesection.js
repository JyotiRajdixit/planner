import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import firebaseDb from "../firebase";
import VoteCard from "./votecard";

const VoteSection = (props) => {

    useEffect(() => {
        firebaseDb.child('challenges').on('value', snapshot => {
            if (snapshot.val() != null) {
                props.setchallengeObjects({
                    ...snapshot.val()
                })
            }
        })
    }, [])

    const onDelete = key => {
        if (window.confirm('Are you sure to delete this challenge?')) {
            firebaseDb.child(`challenges/${key}`).remove(
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
                    <li className="breadcrumb-item"><Link to="/">Challenges</Link></li>
                    <li className="breadcrumb-item active">Voting</li>
                </ol>
            </nav>
            {
                Object.keys(props.challengeObjects).reverse().filter((item) => {
                    if (props.searchTerm === "") {
                        return item;
                    }
                    else if (props.challengeObjects[item].title.toUpperCase().includes(props.searchTerm.toUpperCase().trim())) {
                        return item;
                    }
                    return null;
                }).map(id => {
                    return <div className="row" key={id}>
                        <div className="col-12">
                            <div className="card">
                                <div className="filter" style={{display: props.userId !== props.challengeObjects[id].userId && "none"}}>
                                    <a className="icon" data-bs-toggle="dropdown"><i className="bi bi-three-dots"></i></a>
                                    <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                        <li><a className="dropdown-item" onClick={() => { props.setCurrentId(id)}} data-bs-toggle="modal" data-bs-target="#postChallenge"><i className="bi bi-pencil"></i>Edit</a></li>
                                        <li><a className="dropdown-item" onClick={() => { onDelete(id) }}><i className="bi bi-trash"></i>Delete</a></li>
                                    </ul>
                                </div>
                                <VoteCard
                                    cardId={id}
                                    updateCurrentId={(cid) => { props.setCurrentId(cid) }}
                                    creator={props.challengeObjects[id].creator}
                                    title={props.challengeObjects[id].title}
                                    ideaCount={props.challengeObjects[id].ideas === undefined ? 0 : Object.keys(props.challengeObjects[id].ideas).length}
                                    timeStamp={props.challengeObjects[id].timeStamp}
                                    description={props.challengeObjects[id].description}
                                />
                            </div>
                        </div>
                    </div>
                })
            }
        </div>
    );
}

export default VoteSection;
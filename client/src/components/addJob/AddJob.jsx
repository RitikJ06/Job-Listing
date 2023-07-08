import React from 'react'

import styles from './AddJob.module.css'
import AddJobForm from './addJobForm/AddJobForm'
import AddJobSideImage from './addJobSideImage/AddJobSideImage'

export default function AddJob() {
  return (
    <>
        <AddJobForm />
        <AddJobSideImage/>
    </>
  )

}

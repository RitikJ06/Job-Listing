import React from 'react'
import LoginFormSection from './form_section/LoginFormSection'
import ImageCover from './../common/coverImage/LoginRegisterCover'
import './login.css'

export default function Login() {
  return (
    <main>
      <LoginFormSection/>
      <ImageCover />
    </main>
  )
}

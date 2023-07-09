"use client"

import { auth, uiConfig } from "@/firebase"
import StyledFirebaseAuth from "./StyledFirebaseAuth"

export default function LoginContent() {
  return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
}


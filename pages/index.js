import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import * as cookie from 'cookie'
import { config } from '../dapp.config'

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    router.push('/mint')
  }, [])
  return (
    <div className="min-h-screen h-full w-full flex flex-col bg-brand-light overflow-hidden"></div>
  )
}

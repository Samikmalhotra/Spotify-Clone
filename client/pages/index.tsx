import Head from 'next/head'
import Image from 'next/image'
import GradientLayout from '../components/gradientLayout'
import styles from '../styles/Home.module.css'
import prisma from '../lib/prisma'

export default function Home({artists}) {
  return (
    <GradientLayout color={"red"}>
      <div>home page</div>
    </GradientLayout>
  )
}

export const getServerSideProps = async () => {
  const artists = await prisma.artist.findMany({})

  return {
    props: {artists},
  }
}

import type { AppProps } from "next/app";
import Head from "next/head";
import MainLayout from "@/components/layout/MainLayout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Study Wizard</title>
        <meta
          name="description"
          content="An interactive study application for learning"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </>
  );
}

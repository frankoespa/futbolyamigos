import Head from "next/head";
import { About } from "../src/sections/About";
import { Contact } from "../src/sections/Contact";
import { Footer } from "../src/sections/Footer";
import { Hero } from "../src/sections/Hero";
import { Servicios } from "../src/sections/Servicios";

export function Index () {

    return (
        <>
            <Head>
                <title>Futbol y Amigos - Torneos de fútbol amateur</title>
                <meta name="description" content="Torneos de fútbol amateur en Rosario (Santa Fe)" />
            </Head>
            <Hero />
            <Servicios />
            <About />
            <Contact />
            <Footer />
        </>
    )

}

export default Index;

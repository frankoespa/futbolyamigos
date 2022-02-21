import { About } from "../src/sections/About";
import { Contact } from "../src/sections/Contact";
import { Hero } from "../src/sections/Hero";
import { Servicios } from "../src/sections/Servicios";

export function Index () {

    return (
        <>
            <Hero />
            <Servicios />
            <About />
            <Contact />
        </>
    )

}

export default Index;

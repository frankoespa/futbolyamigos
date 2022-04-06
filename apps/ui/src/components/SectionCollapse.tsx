import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

interface IProps {
    children: JSX.Element | JSX.Element[];
    title: string;
    expanded?: boolean;
}

function SectionCollapse (props: IProps) {
    const { children, title, expanded } = props;

    return (
        <Accordion defaultExpanded elevation={2} expanded={expanded != null ? expanded : undefined}>
            <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: t => t.palette.grey[50] }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{ backgroundColor: t => t.palette.primary.main }}
            >
                <Typography sx={{ fontWeight: 500, color: t => t.palette.grey[50] }}>{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {children}
            </AccordionDetails>
        </Accordion>)
}

export default SectionCollapse;
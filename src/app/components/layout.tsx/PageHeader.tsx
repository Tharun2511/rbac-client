import { Box, Typography } from "@mui/material";

interface Props {
    title: string;
    actions?: React.ReactNode;
}

const PageHeader = ({ title, actions }: Props) => {
    return (
        <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h5" component="h1" fontWeight={600}>
                {title}
            </Typography>
            {actions && <Box>{actions}</Box>}
        </Box>
    )
}

export default PageHeader

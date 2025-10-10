import { Box,  Button, Tooltip } from "@mui/material";
import type { ToolbarButton } from "../types/web.file.system.types";

interface WebFileSystemToolbarComponentProps {
    toolbarButtons: ToolbarButton[];
    showButtonLabel?: boolean;
    showButtonTooltip?: boolean;
}

export const WebFileSystemToolbarComponent = (props: WebFileSystemToolbarComponentProps) => {
    const {
        toolbarButtons,
        showButtonLabel = false,
        showButtonTooltip = true,
    } = props;

    return (
        <Box>
            <Box
                sx={{
                    backgroundColor: '#f0f0f0',
                    p: 1,
                    mb: 1,
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1,
                    flexWrap: 'wrap',
                }}
            >
                {toolbarButtons.map(btn => {
                    const button = (
                            <Button
                                key={btn.key}
                                variant="outlined"
                                size="small"
                                sx={{
                                    textTransform: 'none',
                                    minWidth: showButtonLabel ? 80 : 30,
                                    justifyContent: showButtonLabel ? 'flex-start' : 'center',
                                    paddingLeft: showButtonLabel ? undefined : 0,
                                    paddingRight: showButtonLabel ? undefined : 0,
                                    '.MuiButton-startIcon': !showButtonLabel ? { marginRight: 0 } : undefined,
                                }}
                                onClick={btn.onClick}
                                startIcon={btn.icon}
                            >
                                {showButtonLabel ? btn.label : null}
                            </Button>
                    );
                    return showButtonTooltip
                        ? ( <Tooltip key={btn.key} title={btn.tooltip} arrow>
                                <span>{button}</span>
                            </Tooltip>)
                        : (button);
                })}
            </Box>
        </Box>
    );
};
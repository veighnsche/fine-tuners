import { Box, Theme, useTheme } from '@mui/material'

interface MidBarProps {
  height: ReturnType<Theme['spacing']>
}

export const MidBar = ({ height }: MidBarProps) => {
  const theme = useTheme()
  return (
    <Box
      height={height}
      p={1}
      pb={0}
    >
      <Box
        display="flex"
        borderRadius={`${theme.shape.borderRadius}px`}
        height="100%"
        sx={{
          backgroundColor: theme.palette.divider,
        }}
      >

      </Box>
    </Box>
  )
}
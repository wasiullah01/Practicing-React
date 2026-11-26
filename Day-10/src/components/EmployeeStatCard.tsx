import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'

interface EmployeeStatCardProps {
  label: string
  value: number
  detail: string
  icon: ReactNode
  iconColor: string
  iconBackground: string
}

export default function EmployeeStatCard({
  label,
  value,
  detail,
  icon,
  iconColor,
  iconBackground,
}: EmployeeStatCardProps) {
  return (
    <Card variant="outlined" sx={{ borderColor: 'grey.200', height: '100%' }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ justifyContent: 'space-between' }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              {label}
            </Typography>
            <Typography
              variant="h4"
              sx={{ mt: 1, fontWeight: 700, letterSpacing: '-0.04em' }}
            >
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 42,
              height: 42,
              display: 'grid',
              placeItems: 'center',
              borderRadius: 2.5,
              color: iconColor,
              bgcolor: iconBackground,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Stack>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1.5, display: 'block' }}
        >
          {detail}
        </Typography>
      </CardContent>
    </Card>
  )
}

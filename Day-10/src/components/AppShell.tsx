import { useState } from 'react'
import type { ReactNode } from 'react'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import {
  Bell,
  CircleHelp,
  LayoutDashboard,
  Settings2,
  UserRound,
  UserRoundPlus,
  UsersRound,
} from 'lucide-react'
import HelpDialog from './HelpDialog'
import ProfileSettingsDialog from './ProfileSettingsDialog'
import WorkspaceSettingsDialog from './WorkspaceSettingsDialog'
import { getUserProfile, getWorkspaceName, saveUserProfile, saveWorkspaceName } from '../data/settingsService'
import type { UserProfile } from '../data/settingsService'
import type { Employee } from '../types/employee'

interface AppShellProps {
  children: ReactNode
  employees: Employee[]
  onNewOnboarding: () => void
  onEditEmployee: (employee: Employee) => void
}

function getProfileInitials(profile: UserProfile) {
  return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase()
}

export default function AppShell({
  children,
  employees,
  onNewOnboarding,
  onEditEmployee,
}: AppShellProps) {
  const [workspaceName, setWorkspaceName] = useState(getWorkspaceName)
  const [profile, setProfile] = useState(getUserProfile)
  const [helpOpen, setHelpOpen] = useState(false)
  const [workspaceOpen, setWorkspaceOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationAnchor, setNotificationAnchor] = useState<HTMLElement | null>(null)
  const [workspaceError, setWorkspaceError] = useState('')
  const [profileError, setProfileError] = useState('')

  const onboardingEmployees = employees.filter(
    (employee) => employee.status === 'Onboarding',
  )

  function handleWorkspaceSave(name: string) {
    try {
      saveWorkspaceName(name)
      setWorkspaceName(name)
      setWorkspaceError('')
      setWorkspaceOpen(false)
    } catch (error) {
      setWorkspaceError(
        error instanceof Error
          ? `Workspace settings could not be saved: ${error.message}`
          : 'Workspace settings could not be saved in this browser.',
      )
    }
  }

  function handleProfileSave(nextProfile: UserProfile) {
    try {
      saveUserProfile(nextProfile)
      setProfile(nextProfile)
      setProfileError('')
      setProfileOpen(false)
    } catch (error) {
      setProfileError(
        error instanceof Error
          ? `Profile settings could not be saved: ${error.message}`
          : 'Profile settings could not be saved in this browser.',
      )
    }
  }

  function openWorkspaceSettings() {
    setWorkspaceError('')
    setWorkspaceOpen(true)
  }

  function openProfileSettings() {
    setProfileError('')
    setProfileOpen(true)
  }

  function openEmployeeNotification(employee: Employee) {
    setNotificationAnchor(null)
    onEditEmployee(employee)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        component="aside"
        sx={{
          position: 'fixed',
          insetBlock: 0,
          left: 0,
          zIndex: 1200,
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          width: 256,
          bgcolor: 'background.paper',
          borderRight: 1,
          borderColor: 'divider',
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            height: 76,
            px: 3,
            borderBottom: 1,
            borderColor: 'grey.100',
            alignItems: 'center',
          }}
        >
          <Avatar
            variant="rounded"
            sx={{ width: 38, height: 38, bgcolor: 'primary.main', borderRadius: 2 }}
          >
            <UsersRound size={19} />
          </Avatar>
          <Typography
            variant="h6"
            sx={{ fontSize: 17, fontWeight: 750, letterSpacing: '-0.03em' }}
          >
            peopleflow
          </Typography>
        </Stack>

        <Box sx={{ px: 2, pt: 3 }}>
          <Typography
            variant="overline"
            color="text.disabled"
            sx={{ px: 1.5, fontSize: 10, fontWeight: 700, letterSpacing: '0.16em' }}
          >
            Workspace
          </Typography>
          <Button
            component="a"
            href="#overview"
            fullWidth
            startIcon={<LayoutDashboard size={18} />}
            sx={{
              justifyContent: 'flex-start',
              mt: 1.25,
              px: 1.5,
              py: 1.15,
              bgcolor: 'primary.light',
              color: 'primary.dark',
              '&:hover': { bgcolor: '#e0e7ff' },
            }}
          >
            People overview
          </Button>
          <Button
            fullWidth
            startIcon={<UserRoundPlus size={18} />}
            onClick={onNewOnboarding}
            sx={{
              justifyContent: 'flex-start',
              mt: 0.5,
              px: 1.5,
              py: 1.15,
              color: 'text.secondary',
              '&:hover': { bgcolor: 'grey.50', color: 'text.primary' },
            }}
          >
            New onboarding
          </Button>
        </Box>

        <Box sx={{ mt: 'auto', p: 2 }}>
          <Divider sx={{ mb: 1.5 }} />
          <Button
            fullWidth
            startIcon={<CircleHelp size={17} />}
            onClick={() => setHelpOpen(true)}
            sx={{ justifyContent: 'flex-start', px: 1.5, py: 1.1, color: 'text.secondary' }}
          >
            Help & support
          </Button>
          <Button
            fullWidth
            onClick={openWorkspaceSettings}
            aria-label={`Edit ${workspaceName} workspace`}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 1.5,
              p: 1.25,
              border: 1,
              borderColor: 'grey.200',
              borderRadius: 2,
              bgcolor: 'grey.50',
              color: 'text.primary',
              textAlign: 'left',
              '&:hover': { bgcolor: 'grey.100' },
            }}
          >
            <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', minWidth: 0 }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: 'grey.200',
                  color: 'text.secondary',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {workspaceName.slice(0, 2).toUpperCase()}
              </Avatar>
              <Box sx={{ minWidth: 0, textAlign: 'left' }}>
                <Typography variant="caption" noWrap sx={{ display: 'block', fontWeight: 700 }}>
                  {workspaceName}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                  Free workspace
                </Typography>
              </Box>
            </Stack>
            <Settings2 size={16} color="#64748b" />
          </Button>
        </Box>
      </Box>

      <Box sx={{ minWidth: 0, ml: { lg: '256px' } }}>
        <AppBar
          position="sticky"
          color="inherit"
          elevation={0}
          sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'rgba(255,255,255,0.92)' }}
        >
          <Toolbar sx={{ minHeight: '68px !important', px: { xs: 2.5, sm: 4 } }}>
            <Stack
              direction="row"
              spacing={1.25}
              sx={{ display: { xs: 'flex', lg: 'none' }, alignItems: 'center' }}
            >
              <Avatar variant="rounded" sx={{ width: 32, height: 32, bgcolor: 'primary.main', borderRadius: 1.5 }}>
                <UsersRound size={17} />
              </Avatar>
              <Typography sx={{ fontWeight: 750, letterSpacing: '-0.03em' }}>
                peopleflow
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center' }}
            >
              <Typography variant="body2" color="text.secondary">Workspace</Typography>
              <Typography variant="body2" color="text.disabled">/</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>People overview</Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={{ xs: 1, sm: 2 }}
              sx={{ ml: 'auto', alignItems: 'center' }}
            >
              <IconButton
                aria-label={`Notifications: ${onboardingEmployees.length} employees onboarding`}
                color="default"
                size="small"
                onClick={(event) => setNotificationAnchor(event.currentTarget)}
              >
                <Badge badgeContent={onboardingEmployees.length} color="warning">
                  <Bell size={18} />
                </Badge>
              </IconButton>
              <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
              <Button
                color="inherit"
                onClick={openProfileSettings}
                aria-label={`Edit profile for ${profile.firstName} ${profile.lastName}`}
                sx={{ gap: 1, px: 0.5, textAlign: 'left' }}
              >
                <Avatar sx={{ width: 34, height: 34, bgcolor: '#dbeafe', color: '#1d4ed8', fontSize: 12, fontWeight: 700 }}>
                  {getProfileInitials(profile)}
                </Avatar>
                <Box sx={{ display: { xs: 'none', sm: 'block' }, minWidth: 100 }}>
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', fontWeight: 700, lineHeight: 1.4 }}
                  >
                    {profile.firstName} {profile.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                    {profile.jobTitle}
                  </Typography>
                </Box>
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>
        {children}
      </Box>

      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={() => setNotificationAnchor(null)}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            Onboarding updates
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {onboardingEmployees.length
              ? `${onboardingEmployees.length} employee${onboardingEmployees.length === 1 ? '' : 's'} to review`
              : 'No pending onboarding'}
          </Typography>
        </Box>
        <Divider />
        {onboardingEmployees.length ? (
          onboardingEmployees.map((employee) => (
            <MenuItem
              key={employee.id}
              onClick={() => openEmployeeNotification(employee)}
            >
              <ListItemIcon>
                <UserRoundPlus size={18} />
              </ListItemIcon>
              <ListItemText
                primary={`${employee.firstName} ${employee.lastName}`}
                secondary={`${employee.jobTitle} · ${employee.department}`}
              />
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No employees need review</MenuItem>
        )}
        <Divider />
        <MenuItem
          onClick={() => {
            setNotificationAnchor(null)
            onNewOnboarding()
          }}
        >
          <ListItemIcon>
            <UserRound size={18} />
          </ListItemIcon>
          <ListItemText primary="Start an onboarding" />
        </MenuItem>
      </Menu>

      <HelpDialog open={helpOpen} onClose={() => setHelpOpen(false)} />
      {workspaceOpen && (
        <WorkspaceSettingsDialog
          open={workspaceOpen}
          name={workspaceName}
          error={workspaceError}
          onClose={() => setWorkspaceOpen(false)}
          onSave={handleWorkspaceSave}
        />
      )}
      {profileOpen && (
        <ProfileSettingsDialog
          open={profileOpen}
          profile={profile}
          error={profileError}
          onClose={() => setProfileOpen(false)}
          onSave={handleProfileSave}
        />
      )}
    </Box>
  )
}

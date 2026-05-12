import type { SVGProps } from 'react';

import ArchiveIcon from '../../assets/images/icon-archive.svg?react';
import ArrowLeftIcon from '../../assets/images/icon-arrow-left.svg?react';
import CheckmarkIcon from '../../assets/images/icon-checkmark.svg?react';
import ChevronRightIcon from '../../assets/images/icon-chevron-right.svg?react';
import ClockIcon from '../../assets/images/icon-clock.svg?react';
import CrossIcon from '../../assets/images/icon-cross.svg?react';
import DeleteIcon from '../../assets/images/icon-delete.svg?react';
import FontIcon from '../../assets/images/icon-font.svg?react';
import FontMonospaceIcon from '../../assets/images/icon-font-monospace.svg?react';
import FontSansSerifIcon from '../../assets/images/icon-font-sans-serif.svg?react';
import FontSerifIcon from '../../assets/images/icon-font-serif.svg?react';
import GoogleIcon from '../../assets/images/icon-google.svg?react';
import HidePasswordIcon from '../../assets/images/icon-hide-password.svg?react';
import HomeIcon from '../../assets/images/icon-home.svg?react';
import InfoIcon from '../../assets/images/icon-info.svg?react';
import LockIcon from '../../assets/images/icon-lock.svg?react';
import LogoutIcon from '../../assets/images/icon-logout.svg?react';
import MenuIcon from '../../assets/images/icon-menu.svg?react';
import MoonIcon from '../../assets/images/icon-moon.svg?react';
import PlusIcon from '../../assets/images/icon-plus.svg?react';
import RestoreIcon from '../../assets/images/icon-restore.svg?react';
import SearchIcon from '../../assets/images/icon-search.svg?react';
import SettingsIcon from '../../assets/images/icon-settings.svg?react';
import ShowPasswordIcon from '../../assets/images/icon-show-password.svg?react';
import StatusIcon from '../../assets/images/icon-status.svg?react';
import SunIcon from '../../assets/images/icon-sun.svg?react';
import SystemThemeIcon from '../../assets/images/icon-system-theme.svg?react';
import TagIcon from '../../assets/images/icon-tag.svg?react';

const iconMap = {
  archive: ArchiveIcon,
  'arrow-left': ArrowLeftIcon,
  checkmark: CheckmarkIcon,
  'chevron-right': ChevronRightIcon,
  clock: ClockIcon,
  cross: CrossIcon,
  delete: DeleteIcon,
  font: FontIcon,
  'font-monospace': FontMonospaceIcon,
  'font-sans-serif': FontSansSerifIcon,
  'font-serif': FontSerifIcon,
  google: GoogleIcon,
  'hide-password': HidePasswordIcon,
  home: HomeIcon,
  info: InfoIcon,
  lock: LockIcon,
  logout: LogoutIcon,
  menu: MenuIcon,
  moon: MoonIcon,
  plus: PlusIcon,
  restore: RestoreIcon,
  search: SearchIcon,
  settings: SettingsIcon,
  'show-password': ShowPasswordIcon,
  status: StatusIcon,
  sun: SunIcon,
  'system-theme': SystemThemeIcon,
  tag: TagIcon,
} as const;

export type IconName = keyof typeof iconMap;

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 20, className, ...props }: IconProps) {
  const IconComponent = iconMap[name];
  return (
    <IconComponent
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
      {...props}
    />
  );
}

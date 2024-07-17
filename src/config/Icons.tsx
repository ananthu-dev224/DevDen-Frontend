import { FC } from "react";
import { IconProps } from "../types/type";

export const Home: FC<IconProps> = ({fn}) => (
  <img
    className="w-6 h-6"
    onClick={fn}
    src="https://img.icons8.com/ios-filled/50/environment.png"
    alt="environment"
  />
);

export const Explore: FC<IconProps> = ({fn}) => (
  <img
    className="w-6 h-6"
    onClick={fn}
    src="https://img.icons8.com/ios-filled/50/collaborating-in-circle.png"
    alt="collaborating-in-circle"
  />
);

export const Notification: FC<IconProps> = ({fn}) => (
  <img
    className="w-6 h-6"
    onClick={fn}
    src="https://img.icons8.com/ios-filled/50/alarm.png"
    alt="alarm"
  />
);

export const Host:FC<IconProps> = ({fn}) => (
  <img
    className="w-6 h-6"
    onClick={fn}
    src="https://img.icons8.com/ios/50/add--v1.png"
    alt="add--v1"
  />
);

export const Profile: FC<IconProps> = ({fn}) => (
  <img
    className="w-6 h-6"
    onClick={fn}
    src="https://img.icons8.com/ios-filled/50/developer.png"
    alt="developer"
  />
);

export const Logout: FC<IconProps> = ({fn}) => (
  <img
    className="w-6 h-6"
    onClick={fn}
    src="https://img.icons8.com/ios/50/exit--v1.png"
    alt="exit--v1"
  />
);
import { Pad } from './pad';
import { Mission } from './mission';

export interface Launch {
  isOpen: boolean;
  id: string;
  name: string;
  mission: Mission;
  status: {
    name: string;
  };
  window_start: string;
  net: string;
  pad: Pad;
}

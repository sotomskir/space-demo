import { Location } from './location';

export interface Pad {
  id: number;
  name: string;
  map_url: string;
  latitude: string;
  longitude: string;
  location: Location;
  map_image: string;
  total_launch_count: number;
}

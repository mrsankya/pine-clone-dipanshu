import { Pin } from './types';

export const INITIAL_PINS: Pin[] = [
  {
    id: '1',
    title: 'Cozy Reading Corner',
    imageUrl: 'https://picsum.photos/400/600?random=1',
    author: 'InteriorDaily',
    heightRatio: 1.5,
  },
  {
    id: '2',
    title: 'Mountain Hiking',
    imageUrl: 'https://picsum.photos/400/400?random=2',
    author: 'AdventureTime',
    heightRatio: 1,
  },
  {
    id: '3',
    title: 'Healthy Breakfast',
    imageUrl: 'https://picsum.photos/400/550?random=3',
    author: 'FoodieLife',
    heightRatio: 1.375,
  },
  {
    id: '4',
    title: 'Abstract Art',
    imageUrl: 'https://picsum.photos/400/300?random=4',
    author: 'ArtGallery',
    heightRatio: 0.75,
  },
  {
    id: '5',
    title: 'Urban Photography',
    imageUrl: 'https://picsum.photos/400/500?random=5',
    author: 'CitySnaps',
    heightRatio: 1.25,
  },
  {
    id: '6',
    title: 'Minimalist Desk',
    imageUrl: 'https://picsum.photos/400/450?random=6',
    author: 'TechSetup',
    heightRatio: 1.125,
  },
  {
    id: '7',
    title: 'Forest Path',
    imageUrl: 'https://picsum.photos/400/650?random=7',
    author: 'NatureLovers',
    heightRatio: 1.625,
  },
];

export const API_URL = 'http://localhost:3000/api';
export const UPLOADS_URL = 'http://localhost:3000';
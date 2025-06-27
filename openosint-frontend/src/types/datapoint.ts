export type GPSLocation = {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
};

export type Datapoint = {
  _id: string;
  name: string;
  filename: string;
  description: string;
  eventTime: string;
  exifData: string;
  GPSlocation?: GPSLocation;
  createdAt: string;
  updatedAt: string;
};

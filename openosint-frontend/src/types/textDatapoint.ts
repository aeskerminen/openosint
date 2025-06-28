export type TextDatapoint = {
  _id: string;
  title: string;
  raw_text: string;
  source?: {
    platform?: string;
    url?: string;
    username?: string;
  };
  language?: string;
  translation?: string;
  eventTime?: string;
  location?: {
    name?: string;
    latitude?: number;
    longitude?: number;
    source?: "user" | "NER";
  };
  tags?: string[];
  entities?: {
    persons?: string[];
    organizations?: string[];
    locations?: string[];
  };
  sentiment?: "positive" | "neutral" | "negative";
  confidence?: {
    sentiment?: number;
    location_match?: number;
    entity_recognition?: number;
  };
  notes?: string;
  linked_image_ids?: string[];
  createdAt: string;
  updatedAt?: string;
};

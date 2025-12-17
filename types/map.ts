export interface MapMeta {
  title: string;
  version: string;
  updatedAt: string;
}

export interface Section {
  id: string;
  title: string;
  description: string;
  order: number;
}

export interface Item {
  id: string;
  sectionId: string;
  title: string;
  description: string;
  tags: string[];
  url: string;
  pinned?: boolean;
}

export interface MapData {
  meta: MapMeta;
  sections: Section[];
  items: Item[];
}

export interface SectionWithCount extends Section {
  itemCount: number;
}


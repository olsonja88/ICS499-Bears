export type Dance = {
    id: number;
    title: string;
    description: string;
    categoryId: number;
    countryId: number;
    url?: string;
    createdBy?: string;
}

export type DanceFormData = Omit<Dance, 'id' | 'url'>;

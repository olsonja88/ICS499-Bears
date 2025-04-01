export type Dance = {
    id: number;
    title: string;
    description: string;
    keywords: string;
    categoryId: number;
    countryId: number;
    category: string;
    country: string;
    url?: string;
    createdBy?: string;
}   

export type DanceFormData = Omit<Dance, 'id' | 'url'>;

// Table data
export interface Table {
    id: number;
    name: string;
    label: string;
    description: string;
}

// Search Data
export interface SearchResult {
    tables: Table[];
    total: number;
}

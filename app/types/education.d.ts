export interface EducationCategory {
    id: number;
    name: string;
}

export interface EducationArticle {
    id: number;
    title: string;
    content: string;
    image: string;
    author: string;
    readingTime: string;
    isView: boolean;
    categoryId: number;
    category: EducationCategory;
    createdAt: string;
}

export interface EducationVideo {
    id: number;
    title: string;
    url: string;
    thumbnail: string;
    description: string;
    author: string;
    isView: boolean;
    categoryId: number;
    category: EducationCategory;
    createdAt: string;
}

export interface EducationMeta {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
    from: number;
    to: number;
}

export interface EducationArticleResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: EducationArticle[];
    meta: EducationMeta;
}

export interface EducationVideoResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: EducationVideo[];
    meta: EducationMeta;
}

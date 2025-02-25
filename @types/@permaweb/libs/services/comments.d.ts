import { CommentCreateArgType, CommentDetailType, DependencyType } from 'helpers/types';
export declare function createCommentWith(deps: DependencyType): (args: CommentCreateArgType, callback?: (status: any) => void) => Promise<string>;
export declare function getCommentWith(deps: DependencyType): (id: string) => Promise<CommentDetailType | null>;
export declare function getCommentsWith(_deps: DependencyType): (args: {
    parentId?: string;
    rootId?: string;
}) => Promise<{
    id: any;
    content: string;
    parentId: any;
    rootId: any;
}[]>;

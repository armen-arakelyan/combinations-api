import { BaseEntity } from '../../infrastructure';

export class ResponseEntity extends BaseEntity {
    combinationId: string;

    constructor(combinationId: string) {
        super();
        this.combinationId = combinationId;
    }
}

import { BaseEntity } from '../../infrastructure';

export class CombinationEntity extends BaseEntity {
    combination: string[];

    constructor(combination: string[]) {
        super();
        this.combination = combination;
    }
}

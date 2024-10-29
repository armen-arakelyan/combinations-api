import { BaseEntity } from '../../infrastructure';

export class ItemEntity extends BaseEntity {
    itemName: string;

    constructor(itemName: string) {
        super();
        this.itemName = itemName;
    }
}

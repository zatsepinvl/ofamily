import {Model} from 'redux-orm';

export class SavedModel extends Model {
    static save(newValue) {
        const oldValue = this.hasId(newValue.id) && this.withId(newValue.id);
        return (!oldValue && this.create(newValue)) || oldValue.update(newValue);
    }
}
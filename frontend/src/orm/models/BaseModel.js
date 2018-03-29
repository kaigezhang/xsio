import { Model, attr } from 'redux-orm';
import propTypesMixin from 'redux-orm-proptypes';

const defaultModifier = rel => rel;

class BaseModel extends Model {
  static parse(attributes) {
    return this.create(attributes);
  }

  isPersisted() {
    return this.fetchedAt !== null;
  }

  /*
  扩展refs的方法，比如通过model.includeMany 和 model.includeRef的包含
  对模型方法扩展数据的重写 eg: course.className
  但是应该确保在这里不返回新的对象实例
  */
  get includeRef() {
    /* eslint-disable no-underscore-dangle */
    if (!this.__includeRefClone) {
      this.__includeRefClone = {
        ...this.ref
      };
    }

    return Object.assign(this.__includeRefClone, {
      isPersisted: this.isPersisted()
    });
    /* eslint-enable no-underscore-dangle */
  }
  // 获取所有关联对象
  includeMany(parameters) {
    const clone = this.includeRef;
    const modifier = parameters.modifier || defaultModifier;
    const { relations } = parameters;

    relations.forEach((relation) => {
      const relationObject = modifier(this[relation]);
      clone[relation] = relationObject
        .toModelArray()
        .map(relModel => relModel.includeRef);
    });

    return clone;
  }

  includeFk(relationName) {
    const clone = this.includeRef;
    const relationModel = this[relationName];
    clone[relationName] = relationModel
      ? relationModel.includeRef
      : null;
    return clone;
  }
}

BaseModel.fields = {
  fetchedAt: attr(),
  isFetching: attr()
};

BaseModel.defaultProps = {
  fetchedAt: null,
  isFetching: false
};

export default propTypesMixin(BaseModel);

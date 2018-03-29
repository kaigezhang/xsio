import camelize from 'camelize';

function normalizeRecord(data) {
  const relationships = {};
  if (data.relationships && data.relationships !== []) {
    Object
      .keys(data.relationships)
      .forEach((key) => {
        const relationshipData = data.relationships[key].data;
        if (Array.isArray(relationshipData)) {
          relationships[key] = relationshipData.map(hash => hash.id);
        } else {
          if (relationshipData === null) {
            return;
          }
          relationships[key] = relationshipData.id;
        }
      });
  }
  const record = {
    id: data.id,
    ...data.attributes,
    ...relationships
  };
  return {
    type: camelize(data.type),
    record
  };
}

export function normalizeError(data) {
  if (!data.errors) {
    // throw Error(data);
    console.error(data);
  }

  if (data.errors) {
    return data
      .errors
      .reduce((memo, error) => {
        if (error.status === 403) {
          window.location.push('/login');
        }
        if (error.source && error.source.pointer) {
          const key = camelize(error.source.pointer.replace(/\/data\/attributes\//, ''));
          memo[key] = error.detail;
        }
        return memo;
      }, {});
  }
}

export function normalize(result) {
  let records = [];
  if (Array.isArray(result.data)) {
    records = records.concat(result.data.map(data => normalizeRecord(data)));
  } else {
    records.push(normalizeRecord(result.data));
  }
  if (result.included) {
    records = records.concat(result.included.map(data => normalizeRecord(data)));
  }

  return records.reduce((memo, { type, record }) => {
    if (!memo[type]) {
      memo[type] = {};
    }
    memo[type][record.id] = camelize(record);
    return memo;
  }, {});
}

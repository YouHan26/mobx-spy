import 'mobx';
import renderGraph from './renderGraph.js';

window.__DEV__ = true;

const stack = [];
const observables = {};
const reactionRunRecords = [];
window.__mobxGlobals.spyListeners.push((res) => {
  const {
    type, debugObjectName,
    observableKind,object,
    spyReportStart, name,spyReportEnd,
  } = res;
  if(type === 'add' || type === 'update'){
    observables[debugObjectName] = { kind: observableKind, value: object };
  }
  if(type === 'report-end' && spyReportEnd){
    stack.pop();
    if(stack.length === 0){
      updateDependencyGraph(observables);
      updateReactionChangeLog(reactionRunRecords);
    }
  }
  if(type === 'reaction'){
    reactionRunRecords.push({
      name,
      causedBy: stack[stack.length - 1],
    });
  }
  if(spyReportStart){
    stack.push(res);
  }
})

function updateDependencyGraph(observables) {
  renderGraph(getDependencyTree(observables));
}


function getDependencyTree(observables) {
  const map = new Map();

  function handleAdm(adm) {
    const {values_ = [], name_} = adm;
    const children = [];

    if(map.get(name_)){
      return ;
    }

    [...values_].forEach(([_, observableValue]) => {
      children.push(handleObservableValueNode(observableValue));
    });
    const node = {
      type: adm.constructor.name,
      name: name_,
      children,
    }
    map.set(node.name, node);
    return node;
  }

  function handleObservableValueNode(observableValue) {
    const type = observableValue.constructor.name;
    const children = [];
    const { observers_ = [], value_ } = observableValue;
    [...observers_].forEach((reaction) => {
      children.push(getReactionNode(reaction))
    })
    return {
      type,
      name: observableValue.name_,
      children,
      value: value_,
    };
  }

  function getReactionNode(reaction) {
    const node = {
      type: reaction.constructor.name,
      name: reaction.name_,
      children: [],
    }
    map.set(node.name, node);
    return node;
  }


  Object.keys(observables)
    .forEach((key) => {
      const adm = observables[key].value[window.$mobx];
      handleAdm(adm);
    });

  let nodes = [];
  const edges = [];

  function changeToNodeAndEdge(node) {
    nodes.push({
      id: node.name,
      // label: `${node.type}|${node.name}`
      label: `${node.name}`
    });
    node.children.forEach((childNode) => {
      edges.push({
        source: node.name,
        target: childNode.name,
      });
      changeToNodeAndEdge(childNode);
    })
  }

  [ ...map ].forEach(([_, node]) => {
    changeToNodeAndEdge(node);
  });
  const idMap = {};
  nodes.forEach(({id, label}) => {
    idMap[id] = (label.length > String(idMap[id]).length) ? label : idMap[id];
  })
  nodes = Object.keys(idMap)
    .map((id) => {
      return {id, label: id}
    });
  // console.log(nodes);
  return { nodes, edges };
}

function updateReactionChangeLog(reactionChangeLog) {
  const renderList = reactionChangeLog.map((record) => {
    const { name: reactionName, causedBy } = record;
    if(!causedBy){
      return {
        reactionName,
        causedBy: reactionName
      }
    }

    const { debugObjectName, newValue, oldValue, name, object } = causedBy;
    return {
      reactionName,
      newValue,
      oldValue,
      causedBy: `${debugObjectName}.${name}`
    }
  });
  observer(renderList);
}


let observer = () => {
};

function observe(fn) {
  observer = fn;
}

export default observe;

import { observable, autorun } from 'mobx';

const origin = { name: 'tony', age: 21, parent: {name: 'tony father', age: 42} };
const t = observable(origin);
autorun(() => {
  console.log(t.name, t.age, t.parent.age);
})

setTimeout(() => {
  const origin = { name: 'xiaoming', age: 21 };
  const ss = observable(origin);
  autorun(() => {
    console.log(ss.name, t.age);
  })
  t.parent.age = 44;
  t.parent.age = 45;
  setTimeout(() => {
    ss.name = 'xiaoming2';
  }, 1000)
}, 1000)


t.name = 'tony 1';
t.age = 22
t.parent.age = 43;

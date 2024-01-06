import { Union, Record } from "./fable_modules/fable-library.4.9.0/Types.js";
import { union_type, option_type, list_type, record_type, bool_type, string_type, int32_type } from "./fable_modules/fable-library.4.9.0/Reflection.js";
import { tryFind, map, filter, singleton, append, maxBy, isEmpty, ofArray } from "./fable_modules/fable-library.4.9.0/List.js";
import { join, isNullOrWhiteSpace } from "./fable_modules/fable-library.4.9.0/String.js";
import { equals, createObj, comparePrimitives } from "./fable_modules/fable-library.4.9.0/Util.js";
import { map as map_1 } from "./fable_modules/fable-library.4.9.0/Option.js";
import { createElement } from "react";
import { Interop_reactApi } from "./fable_modules/Feliz.2.7.0/Interop.fs.js";
import { map as map_2, empty, singleton as singleton_1, append as append_1, delay, toList } from "./fable_modules/fable-library.4.9.0/Seq.js";
import { ProgramModule_mkSimple, ProgramModule_run } from "./fable_modules/Fable.Elmish.4.0.0/program.fs.js";
import { Program_withReactSynchronous } from "./fable_modules/Fable.Elmish.React.4.0.0/react.fs.js";

export class Todo extends Record {
    constructor(Id, Description, Completed) {
        super();
        this.Id = (Id | 0);
        this.Description = Description;
        this.Completed = Completed;
    }
}

export function Todo_$reflection() {
    return record_type("App.Todo", [], Todo, () => [["Id", int32_type], ["Description", string_type], ["Completed", bool_type]]);
}

export class TodoBeingEdited extends Record {
    constructor(Id, Description) {
        super();
        this.Id = (Id | 0);
        this.Description = Description;
    }
}

export function TodoBeingEdited_$reflection() {
    return record_type("App.TodoBeingEdited", [], TodoBeingEdited, () => [["Id", int32_type], ["Description", string_type]]);
}

export class State extends Record {
    constructor(TodoList, NewTodo, TodoBeingEdited) {
        super();
        this.TodoList = TodoList;
        this.NewTodo = NewTodo;
        this.TodoBeingEdited = TodoBeingEdited;
    }
}

export function State_$reflection() {
    return record_type("App.State", [], State, () => [["TodoList", list_type(Todo_$reflection())], ["NewTodo", string_type], ["TodoBeingEdited", option_type(TodoBeingEdited_$reflection())]]);
}

export class Msg extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["SetNewTodo", "AddNewTodo", "DeleteTodo", "ToggleCompleted", "CancelEdit", "ApplyEdit", "StartEditingTodo", "SetEditedDescription"];
    }
}

export function Msg_$reflection() {
    return union_type("App.Msg", [], Msg, () => [[["Item", string_type]], [], [["Item", int32_type]], [["Item", int32_type]], [], [], [["Item", int32_type]], [["Item", string_type]]]);
}

export function init() {
    return new State(ofArray([new Todo(1, "Learn F#", false), new Todo(2, "Learn Elmish", true)]), "", void 0);
}

export function update(msg, state) {
    let todoBeingEdited;
    switch (msg.tag) {
        case 1:
            if (isNullOrWhiteSpace(state.NewTodo)) {
                return state;
            }
            else {
                let nextTodoId;
                const matchValue = state.TodoList;
                if (isEmpty(matchValue)) {
                    nextTodoId = 1;
                }
                else {
                    const elems = matchValue;
                    nextTodoId = (maxBy((todo) => todo.Id, elems, {
                        Compare: comparePrimitives,
                    }).Id + 1);
                }
                const nextTodo = new Todo(nextTodoId, state.NewTodo, false);
                return new State(append(state.TodoList, singleton(nextTodo)), "", state.TodoBeingEdited);
            }
        case 2: {
            const todoId = msg.fields[0] | 0;
            const nextTodoList = filter((todo_2) => (todo_2.Id !== todoId), state.TodoList);
            return new State(nextTodoList, state.NewTodo, state.TodoBeingEdited);
        }
        case 3: {
            const todoId_1 = msg.fields[0] | 0;
            const nextTodoList_1 = map((todo_3) => {
                if (todo_3.Id === todoId_1) {
                    return new Todo(todo_3.Id, todo_3.Description, !todo_3.Completed);
                }
                else {
                    return todo_3;
                }
            }, state.TodoList);
            return new State(nextTodoList_1, state.NewTodo, state.TodoBeingEdited);
        }
        case 6: {
            const todoId_2 = msg.fields[0] | 0;
            const nextEditModel = map_1((todo_5) => (new TodoBeingEdited(todoId_2, todo_5.Description)), tryFind((todo_4) => (todo_4.Id === todoId_2), state.TodoList));
            return new State(state.TodoList, state.NewTodo, nextEditModel);
        }
        case 4:
            return new State(state.TodoList, state.NewTodo, void 0);
        case 5: {
            const matchValue_1 = state.TodoBeingEdited;
            if (matchValue_1 != null) {
                if ((todoBeingEdited = matchValue_1, todoBeingEdited.Description === "")) {
                    const todoBeingEdited_1 = matchValue_1;
                    return state;
                }
                else {
                    const todoBeingEdited_2 = matchValue_1;
                    const nextTodoList_2 = map((todo_6) => {
                        if (todo_6.Id === todoBeingEdited_2.Id) {
                            return new Todo(todo_6.Id, todoBeingEdited_2.Description, todo_6.Completed);
                        }
                        else {
                            return todo_6;
                        }
                    }, state.TodoList);
                    return new State(nextTodoList_2, state.NewTodo, void 0);
                }
            }
            else {
                return state;
            }
        }
        case 7: {
            const newText = msg.fields[0];
            const nextEditModel_1 = map_1((todoBeingEdited_3) => (new TodoBeingEdited(todoBeingEdited_3.Id, newText)), state.TodoBeingEdited);
            return new State(state.TodoList, state.NewTodo, nextEditModel_1);
        }
        default: {
            const desc = msg.fields[0];
            return new State(state.TodoList, desc, state.TodoBeingEdited);
        }
    }
}

export function div(classes, children) {
    return createElement("div", {
        className: join(" ", classes),
        children: Interop_reactApi.Children.toArray(Array.from(children)),
    });
}

export const appTitle = createElement("p", {
    className: "title",
    children: "Elmish To-Do List",
});

export function inputField(state, dispatch) {
    let value_1, elems;
    return div(ofArray(["field", "has-addons"]), ofArray([div(ofArray(["control", "is-expanded"]), singleton(createElement("input", createObj(ofArray([["className", join(" ", ["input", "is-medium"])], (value_1 = state.NewTodo, ["ref", (e) => {
        if (!(e == null) && !equals(e.value, value_1)) {
            e.value = value_1;
        }
    }]), ["onChange", (ev) => {
        dispatch(new Msg(0, [ev.target.value]));
    }]]))))), div(singleton("control"), singleton(createElement("button", createObj(ofArray([["className", join(" ", ["button", "is-primary", "is-medium"])], ["onClick", (_arg) => {
        dispatch(new Msg(1, []));
    }], (elems = [createElement("i", {
        className: join(" ", ["fa", "fa-plus"]),
    })], ["children", Interop_reactApi.Children.toArray(Array.from(elems))])])))))]));
}

export function renderTodo(todo, dispatch) {
    let elems, elems_1, elems_2;
    return div(singleton("box"), singleton(div(ofArray(["columns", "is-mobile", "is-vcentered"]), ofArray([div(ofArray(["column", "subtitle"]), singleton(createElement("p", {
        className: "subtitle",
        children: todo.Description,
    }))), div(ofArray(["column", "is-narrow"]), singleton(div(singleton("buttons"), ofArray([createElement("button", createObj(ofArray([["className", join(" ", toList(delay(() => append_1(singleton_1("button"), delay(() => (todo.Completed ? singleton_1("is-success") : empty()))))))], ["onClick", (_arg) => {
        dispatch(new Msg(3, [todo.Id]));
    }], (elems = [createElement("i", {
        className: join(" ", ["fa", "fa-check"]),
    })], ["children", Interop_reactApi.Children.toArray(Array.from(elems))])]))), createElement("button", createObj(ofArray([["className", join(" ", ["button", "is-primary"])], ["onClick", (_arg_1) => {
        dispatch(new Msg(6, [todo.Id]));
    }], (elems_1 = [createElement("i", {
        className: join(" ", ["fa", "fa-edit"]),
    })], ["children", Interop_reactApi.Children.toArray(Array.from(elems_1))])]))), createElement("button", createObj(ofArray([["className", join(" ", ["button", "is-danger"])], ["onClick", (_arg_2) => {
        dispatch(new Msg(2, [todo.Id]));
    }], (elems_2 = [createElement("i", {
        className: join(" ", ["fa", "fa-times"]),
    })], ["children", Interop_reactApi.Children.toArray(Array.from(elems_2))])])))]))))]))));
}

export function renderEditForm(todoBeingEdited, dispatch) {
    let value_1, elems, elems_1;
    return div(singleton("box"), singleton(div(singleton("field is-grouped"), ofArray([div(singleton("control is-expanded"), singleton(createElement("input", createObj(ofArray([["className", join(" ", ["input", "is-medium"])], (value_1 = todoBeingEdited.Description, ["ref", (e) => {
        if (!(e == null) && !equals(e.value, value_1)) {
            e.value = value_1;
        }
    }]), ["onChange", (ev) => {
        dispatch(new Msg(7, [ev.target.value]));
    }]]))))), div(ofArray(["control", "buttons"]), ofArray([createElement("button", createObj(ofArray([["className", join(" ", ["button", "is-primary"])], ["onClick", (_arg) => {
        dispatch(new Msg(5, []));
    }], (elems = [createElement("i", {
        className: join(" ", ["fa", "fa-save"]),
    })], ["children", Interop_reactApi.Children.toArray(Array.from(elems))])]))), createElement("button", createObj(ofArray([["className", join(" ", ["button", "is-warning"])], ["onClick", (_arg_1) => {
        dispatch(new Msg(4, []));
    }], (elems_1 = [createElement("i", {
        className: join(" ", ["fa", "fa-arrow-right"]),
    })], ["children", Interop_reactApi.Children.toArray(Array.from(elems_1))])])))]))]))));
}

export function todoList(state, dispatch) {
    let elems;
    return createElement("ul", createObj(singleton((elems = toList(delay(() => map_2((todo) => {
        let todoBeingEdited;
        const matchValue = state.TodoBeingEdited;
        let matchResult, todoBeingEdited_1, otherwise;
        if (matchValue != null) {
            if ((todoBeingEdited = matchValue, todoBeingEdited.Id === todo.Id)) {
                matchResult = 0;
                todoBeingEdited_1 = matchValue;
            }
            else {
                matchResult = 1;
                otherwise = matchValue;
            }
        }
        else {
            matchResult = 1;
            otherwise = matchValue;
        }
        switch (matchResult) {
            case 0:
                return renderEditForm(todoBeingEdited_1, dispatch);
            default:
                return renderTodo(todo, dispatch);
        }
    }, state.TodoList))), ["children", Interop_reactApi.Children.toArray(Array.from(elems))]))));
}

export function render(state, dispatch) {
    let elems;
    return createElement("div", createObj(ofArray([["style", {
        padding: 20,
    }], (elems = [appTitle, inputField(state, dispatch), todoList(state, dispatch)], ["children", Interop_reactApi.Children.toArray(Array.from(elems))])])));
}

ProgramModule_run(Program_withReactSynchronous("elmish-app", ProgramModule_mkSimple(init, update, render)));

//# sourceMappingURL=App.js.map

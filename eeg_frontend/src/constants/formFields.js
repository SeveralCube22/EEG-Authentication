const loginFields=[
    {
        labelText: "Username",
        labelFor: "username",
        id:"username",
        name:"username",
        autocomplete:"username",
        isRequired: true,
        placeholder: "Username"
    }
];

const adminLoginFields = [
    {
        labelText: "Username",
        labelFor: "username",
        id:"username",
        name:"username",
        autocomplete:"username",
        isRequired: true,
        placeholder: "Username"
    },
    {
        labelText:"Password",
        labelFor:"password",
        id:"password",
        name:"password",
        type:"password",
        autoComplete:"current-password",
        isRequired:true,
        placeholder:"Password"
    }
]

export {loginFields, adminLoginFields};
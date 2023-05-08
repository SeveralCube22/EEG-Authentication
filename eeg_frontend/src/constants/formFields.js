const loginFields=[
    {
        labelText: "Email",
        labelFor: "email",
        id:"email",
        name:"email",
        autocomplete:"email",
        isRequired: true,
        placeholder: "Email"
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
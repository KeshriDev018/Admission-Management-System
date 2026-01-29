usecaseDiagram
    actor "Student" as S
    actor "Verifier" as V
    actor "Accountant" as Acc
    actor "Administrator" as Admin

    package "Admission Management System" {

        usecase "Login" as UC1

        %% Student Use Cases
        usecase "Register" as UC2
        usecase "Fill Application Form" as UC3
        usecase "Upload Documents" as UC4
        usecase "Pay Fees" as UC5

        %% Verifier Use Cases
        usecase "Verify Documents" as UC7
        usecase "Update Status (Approve/Reject)" as UC8

        %% Accountant Use Cases
        usecase "Update Payment Status" as UC9
        usecase "Generate Fee Reports" as UC10

        %% Administrator Use Cases
        usecase "Manage Courses & Seats" as UC11
        usecase "Generate Merit List" as UC12
        usecase "Manage Users" as UC13

    }

    %% Relationships
    S --> UC2
    S --> UC3
    S --> UC4
    S --> UC5

    V --> UC7
    V --> UC8

    Acc --> UC9
    Acc --> UC10

    Admin --> UC11
    Admin --> UC12
    Admin --> UC13

    %% Include Relationships (All require Login)
    UC3 .> UC1 : <<include>>
    UC5 .> UC1 : <<include>>
    UC7 .> UC1 : <<include>>
    UC9 .> UC1 : <<include>>
    UC11 .> UC1 : <<include>>

    %% Dependencies
    UC8 ..> UC7 : <<extends>>
    UC9 ..> UC5 : <<verifies>>

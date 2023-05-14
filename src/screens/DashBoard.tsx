import { gql, useMutation, useQuery } from "@apollo/client";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import styled from "@emotion/styled";
import React from "react";
import { startCase, uniq } from "lodash";
import { SubmissionsQuery } from "../gql/graphql";

const Container = styled.div`
    display: flex;
    height: 100vh;
    width: 99vw;
    flex-direction: column;
`;

const ToolBar = styled.div`
    display: flex;
    justify-content: space-between;
    background: rgb(255, 193, 204, 0.9);
    padding: 12px;
    border: none;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.3);
`;

const Button = styled.button`
    background: black;
    color: white;
    border-radius: 8px;
    padding: 12px 15px;
`;

const Text = styled.h1`
    color: black;
    font-size: 24px;
    margin: 0;
    padding: 0 10px;
`;

const DashBoard = () => {
    const { data, loading, error } = useQuery<SubmissionsQuery>(gql`
        query Submissions {
            submissions {
                id
                submittedAt
                data
            }
        }
    `);

    const [generateSubmissions] = useMutation(
        gql`
            mutation GenerateSubmissions($count: Int!) {
                queueSubmissionGeneration(count: $count)
            }
        `,
        { variables: { count: 10 }, refetchQueries: ["Submissions"] }
    );

    if (loading) {
        return <div>Loading data ...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const { submissions } = data!;

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 200 },
        { field: "submittedAt", headerName: "Submitted", width: 200 },
        ...uniq(submissions.flatMap((s) => Object.keys(s.data))).map(
            (field) => ({
                field,
                headerName: startCase(field),
                width: 200,
                valueGetter: (params: GridValueGetterParams) =>
                    params.row.data[field],
            })
        ),
    ];

    return (
        <Container>
            <ToolBar>
                <Text>Forms Processor</Text>
                <Button
                    onClick={() => {
                        generateSubmissions();
                    }}
                >
                    Generate Submissions
                </Button>
            </ToolBar>
            <DataGrid
                rows={submissions}
                columns={columns}
                sx={{
                    margin: 4,
                    boxShadow: 5,
                    background: "rgb(255, 193, 204, 0.35)",
                }}
                disableRowSelectionOnClick
            />
        </Container>
    );
};

export default DashBoard;

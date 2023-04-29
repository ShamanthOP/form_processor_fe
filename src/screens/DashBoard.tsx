import { gql, useQuery } from "@apollo/client";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import styled from "@emotion/styled";
import React from "react";
import { startCase, uniq } from "lodash";
import { SubmissionsQuery } from "../gql/graphql";

const Container = styled.div`
    display: flex;
    height: 100vh;
    width: 100vw;
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
            <DataGrid
                rows={submissions}
                columns={columns}
                disableRowSelectionOnClick
            />
        </Container>
    );
};

export default DashBoard;

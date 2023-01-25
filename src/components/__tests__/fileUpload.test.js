import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileUpload from '../FileUpload';

describe('<FileUpload />', () => {
    render(<FileUpload />);
    let file = new File(["oldUrl", "newUrl", "status", "comment"], "test.csv", { type: "text/csv" });
    const fileInput = screen.getByLabelText(/Choose File/i);
    
    test('Should render a label and a file input field', async() => {
        expect(fileInput).toBeInTheDocument();
    });

    test('Should upload a file', async() => {
        expect(fileInput.files.length).toBe(0);
        userEvent.upload(fileInput, file);
        await waitFor(() => {
            expect(fileInput.files.length).toBe(1);
        });
    });
});
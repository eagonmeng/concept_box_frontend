# **Endpoint Addition:** List Files Shared With Me

Based on feedback during development, we have added a new endpoint to allow users to see which files have been shared *with them* by other users. This is crucial for discovering content and complements the existing `/api/my-files` endpoint.

#### **List Files Shared With Me**

*   **Endpoint:** `POST /api/my-shares`
*   **Description:** Retrieves a list of all files that other users have explicitly shared with the currently logged-in user.
*   **Authentication:** Required.
*   **Request Body:**
    ```json
    {
      "session": "c4a9a2c1-2f0f-4e1d-8f1b-1e7a6b2c8a7d"
    }
    ```
*   **Success Response:** The response is a JSON object containing a `results` array. Each object in the array represents a shared file and includes the file's ID, its name, and the username of the person who owns and shared it.
    ```json
    {
      "results": [
        {
          "file": "a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6",
          "filename": "Project Brief Q4.docx",
          "ownerUsername": "bob"
        },
        {
          "file": "f9e8d7c6-b5a4-f3e2-d1c0-b9a8f7e6d5c4",
          "filename": "team_photo.png",
          "ownerUsername": "charlie"
        }
      ]
    }
    ```
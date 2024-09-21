# ECE 461 Project

## Description
This project implements a Command Line Interface (CLI) tool designed for ACME Corporation to assess the re-usability and trustworthiness of open-source npm modules, particularly those hosted on GitHub. The tool evaluates various metrics, such as ramp-up time, correctness, security risks, license compatibility, and responsiveness, to help developers make informed decisions when considering the re-use of software packages.

The CLI interacts with the GitHub API and performs local static and dynamic analysis on cloned repositories. It also provides modularity to allow the addition of new metrics as needed.

## Installation

### Prerequisites
Make sure the following dependencies are installed:
- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **Git** (for cloning repositories)
- A **GitHub API Token** (used for API access)
- **isomorphic-git** library (installed via npm)

### Steps
1. Clone the project repository:
    ```bash
    git clone https://github.com/Miller11k/ECE-461.git
    cd ECE-461
    ```

2. Install project dependencies:
    ```bash
    npm install
    ```

3. Set your GitHub API token as an environment variable:
    ```bash
    export GITHUB_TOKEN=your_personal_token_here
    ```

## Usage
The CLI is designed to analyze npm modules by interacting with GitHub repositories and running metric evaluations. To run the tool, use the following command:

```bash
npm run cli -- [OPTIONS]
```

## Options
The CLI provides several options to customize its behavior:

- `--repo`: **(Required)** Specifies the URL of the GitHub repository to analyze.
- `--metrics`: **(Optional)** Comma-separated list of metrics to evaluate (e.g., `correctness`, `security`, `license`). If not specified, all available metrics will be evaluated.
- `--output`: **(Optional)** Specifies the output format (`json`, `yaml`, or `text`). Default is `text`.
- `--parallel`: **(Optional)** Enables parallel processing to analyze multiple repositories concurrently.
- `--log-level`: **(Optional)** Defines the verbosity of logs (`info`, `debug`, `warn`). Default is `info`.

## Configuration
The CLI requires a GitHub token for API access. To configure this:

1. Obtain a GitHub personal access token by following [this guide](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).
2. Set the token as an environment variable in your terminal:

   ```bash
   export GITHUB_TOKEN=your_personal_token_here

## Contributing
We welcome contributions from the community. To contribute, please follow these steps:

1. Fork the repository.
2. Create a new feature branch:

    ```bash
    git checkout -b feature/your-feature-name
    ```

3. Make your changes and commit them:

    ```bash
    git commit -m "Add feature description"
    ```

4. Push the branch to your fork:

    ```bash
    git push origin feature/your-feature-name
    ```

5. Create a pull request (PR) on the main repository and describe your changes in detail.

### Contribution Guidelines:
- Ensure all new features are tested and documented.
- Follow the project’s coding style and best practices.
- Cite any code snippets or tools reused from third-party sources, including links to the original posts (e.g., Stack Overflow).

## License
This project is licensed under the MIT License. For more details, see the [LICENSE](https://github.com/Miller11k/ECE-461/blob/main/src/metrics/license.ts) file in the repository.

## Contact
If you have any questions, suggestions, or need further information, feel free to reach out:

- **Project Lead**: Miller Kodish  
  Email: [mkodish@purdue.edu](mailto:mkodish@purdue.edu)

- GitHub: [Miller11k](https://github.com/Miller11k)


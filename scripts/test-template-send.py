#!/usr/bin/env python3

import argparse
import json
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path
from typing import Dict, List, Optional


ROOT_DIR = Path(__file__).resolve().parent.parent
COMPILED_DIR = ROOT_DIR / "mail" / "templates" / "compiled"
REFERENCE_DOC = ROOT_DIR / "docs" / "template-technical-reference.md"
DEFAULT_ENDPOINT = "http://localhost:8025/graphql"
GRAPHQL_QUERY = (
    "mutation sendMailWithTemplate($input: MailTemplateInput!) { "
    "sendMailWithTemplate(input: $input) { success message } }"
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Interactive helper to send template emails through Morgans GraphQL."
    )
    parser.add_argument(
        "--endpoint",
        default=DEFAULT_ENDPOINT,
        help=f"GraphQL endpoint (default: {DEFAULT_ENDPOINT})",
    )
    parser.add_argument(
        "--list-templates",
        action="store_true",
        help="List available compiled templates with expected variables.",
    )
    parser.add_argument("--template", help="Compiled template filename to use.")
    parser.add_argument("--to", help="Recipient email address.")
    parser.add_argument("--subject", help="Email subject.")
    parser.add_argument(
        "--var",
        action="append",
        default=[],
        metavar="KEY=VALUE",
        help="Template variable. Can be repeated.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print the GraphQL payload instead of sending it.",
    )
    return parser.parse_args()


def load_template_metadata() -> Dict[str, Dict[str, object]]:
    metadata: Dict[str, Dict[str, object]] = {}

    if not REFERENCE_DOC.exists():
        return metadata

    in_catalog = False
    for line in REFERENCE_DOC.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if stripped == "## Template catalog":
            in_catalog = True
            continue

        if in_catalog and stripped.startswith("## "):
            break

        if not in_catalog or not stripped.startswith("|"):
            continue

        cells = [cell.strip() for cell in stripped.strip("|").split("|")]
        if len(cells) != 3 or cells[0] == "Template" or cells[0].startswith("---"):
            continue

        template_names = re.findall(r"`([^`]+)`", cells[0])
        variable_names = re.findall(r"`([^`]+)`", cells[2])
        description = cells[1]

        for template_name in template_names:
            metadata[template_name] = {
                "description": description,
                "variables": variable_names,
            }

    return metadata


def list_compiled_templates() -> List[str]:
    if not COMPILED_DIR.exists():
        return []
    return sorted(path.name for path in COMPILED_DIR.glob("*.html"))


def prompt_non_empty(label: str, default: Optional[str] = None) -> str:
    while True:
        suffix = f" [{default}]" if default else ""
        value = input(f"{label}{suffix}: ").strip()
        if value:
            return value
        if default:
            return default
        print("Valeur requise.")


def choose_template(templates: List[str], metadata: Dict[str, Dict[str, object]]) -> str:
    print("\nTemplates disponibles:\n")
    for index, template_name in enumerate(templates, start=1):
        template_metadata = metadata.get(template_name, {})
        variables = template_metadata.get("variables", [])
        description = template_metadata.get("description", "No description")
        variables_text = ", ".join(variables) if variables else "none"
        print(f"{index:>2}. {template_name}")
        print(f"    {description}")
        print(f"    Variables: {variables_text}")

    while True:
        raw_choice = input("\nNuméro du template: ").strip()
        if raw_choice.isdigit():
            selected_index = int(raw_choice)
            if 1 <= selected_index <= len(templates):
                return templates[selected_index - 1]
        print("Choix invalide.")


def parse_key_value_pairs(items: List[str]) -> Dict[str, str]:
    variables: Dict[str, str] = {}
    for item in items:
        if "=" not in item:
            raise ValueError(f"Invalid --var value: {item!r}. Expected KEY=VALUE.")
        key, value = item.split("=", 1)
        key = key.strip()
        if not key:
            raise ValueError(f"Invalid --var key in: {item!r}")
        variables[key] = value
    return variables


def collect_variables(
    template_name: str,
    metadata: Dict[str, Dict[str, object]],
    cli_variables: Dict[str, str],
) -> Dict[str, str]:
    template_metadata = metadata.get(template_name, {})
    expected_variables = list(template_metadata.get("variables", []))
    variables = dict(cli_variables)

    if expected_variables:
        print("\nVariables attendues:\n")
        for variable_name in expected_variables:
            print(f"- {variable_name}")

    for variable_name in expected_variables:
        if variable_name not in variables:
            variables[variable_name] = prompt_non_empty(variable_name)

    if not expected_variables and not variables:
        print("\nAucune variable documentée pour ce template.")

    return variables


def build_payload(
    recipient: str,
    subject: str,
    template_name: str,
    variables: Dict[str, str],
) -> Dict[str, object]:
    return {
        "query": GRAPHQL_QUERY,
        "variables": {
            "input": {
                "to": recipient,
                "subject": subject,
                "template": template_name,
                "variables": variables,
            }
        },
    }


def send_payload(endpoint: str, payload: Dict[str, object]) -> Dict[str, object]:
    request = urllib.request.Request(
        endpoint,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    with urllib.request.urlopen(request) as response:
        body = response.read().decode("utf-8")
        return json.loads(body)


def print_template_list(templates: List[str], metadata: Dict[str, Dict[str, object]]) -> None:
    for template_name in templates:
        template_metadata = metadata.get(template_name, {})
        variables = template_metadata.get("variables", [])
        description = template_metadata.get("description", "No description")
        variables_text = ", ".join(variables) if variables else "none"
        print(f"{template_name}: {description}")
        print(f"  variables: {variables_text}")


def main() -> int:
    args = parse_args()
    metadata = load_template_metadata()
    templates = list_compiled_templates()

    if not templates:
        print("Aucun template compilé trouvé dans mail/templates/compiled.", file=sys.stderr)
        return 1

    if args.list_templates:
        print_template_list(templates, metadata)
        return 0

    try:
        cli_variables = parse_key_value_pairs(args.var)
    except ValueError as error:
        print(str(error), file=sys.stderr)
        return 1

    if args.template:
        template_name = args.template
        if template_name not in templates:
            print(
                f"Template introuvable: {template_name}. Utilise --list-templates pour voir les options.",
                file=sys.stderr,
            )
            return 1
    else:
        template_name = choose_template(templates, metadata)

    recipient = args.to or prompt_non_empty("\nDestinataire")
    subject = args.subject or prompt_non_empty("Sujet")
    variables = collect_variables(template_name, metadata, cli_variables)
    payload = build_payload(recipient, subject, template_name, variables)

    print("\nRésumé:\n")
    print(f"- endpoint: {args.endpoint}")
    print(f"- to: {recipient}")
    print(f"- subject: {subject}")
    print(f"- template: {template_name}")
    print(f"- variables: {json.dumps(variables, ensure_ascii=False)}")

    if args.dry_run:
        print("\nPayload GraphQL:\n")
        print(json.dumps(payload, indent=2, ensure_ascii=False))
        return 0

    confirmation = input("\nEnvoyer ce mail ? [y/N]: ").strip().lower()
    if confirmation not in {"y", "yes", "o", "oui"}:
        print("Envoi annulé.")
        return 0

    try:
        response = send_payload(args.endpoint, payload)
    except urllib.error.HTTPError as error:
        print(f"HTTP {error.code}: {error.read().decode('utf-8', errors='replace')}", file=sys.stderr)
        return 1
    except urllib.error.URLError as error:
        print(f"Erreur réseau: {error.reason}", file=sys.stderr)
        return 1

    print("\nRéponse:\n")
    print(json.dumps(response, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())

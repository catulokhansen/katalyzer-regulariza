#!/usr/bin/env bash
# Deploy Katalyzer Regulariza to Hostinger VPS.
# Sends source to /app on the VPS and rebuilds the container there.
#
# Usage: ./deploy.sh
# Override defaults with env vars, e.g.: VPS_USER=ubuntu ./deploy.sh

set -euo pipefail

VPS_HOST="${VPS_HOST:-187.77.62.100}"
VPS_USER="${VPS_USER:-root}"
REMOTE_PATH="${REMOTE_PATH:-/app/katalyzer-regulariza}"
SSH_PORT="${SSH_PORT:-22}"

SSH_TARGET="${VPS_USER}@${VPS_HOST}"

echo "==> Garantindo que ${REMOTE_PATH} exista em ${SSH_TARGET}"
ssh -p "${SSH_PORT}" "${SSH_TARGET}" "mkdir -p '${REMOTE_PATH}'"

echo "==> Sincronizando código para ${SSH_TARGET}:${REMOTE_PATH}"
rsync -avz --delete \
  -e "ssh -p ${SSH_PORT}" \
  --exclude '.git' \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude 'tsconfig.tsbuildinfo' \
  --exclude '.env.local' \
  --exclude '.DS_Store' \
  ./ "${SSH_TARGET}:${REMOTE_PATH}/"

echo "==> Build + up no VPS"
ssh -p "${SSH_PORT}" "${SSH_TARGET}" "cd '${REMOTE_PATH}' && docker compose up -d --build"

echo "==> Status"
ssh -p "${SSH_PORT}" "${SSH_TARGET}" "cd '${REMOTE_PATH}' && docker compose ps"

echo "==> Pronto. Acesse http://${VPS_HOST}:8081"

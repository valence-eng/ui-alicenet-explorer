import { Button } from '@chakra-ui/react';
import React from 'react';

import type { L2WithdrawalStatus } from 'types/api/l2Withdrawals';
import { WITHDRAWAL_STATUSES } from 'types/api/l2Withdrawals';

import config from 'configs/app';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import VerificationSteps from 'ui/shared/verificationSteps/VerificationSteps';

interface Props {
  status: L2WithdrawalStatus | undefined;
  l1TxHash: string | undefined;
}

const TxDetailsWithdrawalStatus = ({ status, l1TxHash }: Props) => {
  if (!config.features.optimisticRollup.isEnabled) {
    return null;
  }

  if (!status || !WITHDRAWAL_STATUSES.includes(status)) {
    return null;
  }

  const rightSlot = (() => {
    if (status === 'Relayed' && l1TxHash) {
      return <TxEntityL1 hash={ l1TxHash } truncation="constant"/>;
    }

    if (status === 'Ready for relay') {
      return (
        <Button
          variant="outline"
          size="sm"
          as="a"
          href="https://app.optimism.io/bridge/withdraw"
          target="_blank"
        >
            Claim funds
        </Button>
      );
    }

    return null;
  })();

  return (
    <DetailsInfoItem
      title="Withdrawal status"
      hint="Detailed status progress of the transaction"
    >
      <VerificationSteps
        steps={ WITHDRAWAL_STATUSES as unknown as Array<L2WithdrawalStatus> }
        step={ status }
        rightSlot={ rightSlot }
        my={ status === 'Ready for relay' ? '-6px' : 0 }
        lineHeight={ status === 'Ready for relay' ? 8 : undefined }
      />
    </DetailsInfoItem>
  );
};

export default React.memo(TxDetailsWithdrawalStatus);

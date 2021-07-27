package dipl.spi.spi_backend.mappers;

import dipl.spi.spi_backend.dto.AccountDto;
import dipl.spi.spi_backend.dto.PaymentSplitDto;
import dipl.spi.spi_backend.model.Account;
import dipl.spi.spi_backend.model.AppUser;
import dipl.spi.spi_backend.model.Article;
import dipl.spi.spi_backend.model.PaymentSplit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PaymentSplitMapper {

    @Autowired
    private AccountMapper accountMapper;

    public PaymentSplit paymentSplitDtoToPaymentSplit(PaymentSplitDto paymentSplitDto,
                                                      Article article, Account account) {
        PaymentSplit paymentSplit = new PaymentSplit();
        paymentSplit.setId(paymentSplitDto.getId());
        paymentSplit.setAmount(paymentSplitDto.getAmount());
        paymentSplit.setArticle(article);

        if(account != null) {
            paymentSplit.setAccount(account);
        }

        return paymentSplit;
    }

    public PaymentSplitDto paymentSplitToPaymentSplitDto(PaymentSplit paymentSplit) {

        PaymentSplitDto paymentSplitDto = new PaymentSplitDto();

        paymentSplitDto.setId(paymentSplit.getId());
        paymentSplitDto.setArticleId(paymentSplit.getArticle().getId());
        paymentSplitDto.setAmount(paymentSplit.getAmount());

        AccountDto accountDto = accountMapper.accountToAccountDto(paymentSplit.getAccount());
        paymentSplitDto.setAccount(accountDto);

        return paymentSplitDto;
    }

}

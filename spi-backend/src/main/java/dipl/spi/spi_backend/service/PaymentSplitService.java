package dipl.spi.spi_backend.service;

import dipl.spi.spi_backend.dto.PaymentSplitDto;
import dipl.spi.spi_backend.exception.ApiBadRequestException;
import dipl.spi.spi_backend.exception.ApiNotFoundException;
import dipl.spi.spi_backend.model.Account;
import dipl.spi.spi_backend.model.AppUser;
import dipl.spi.spi_backend.model.Article;
import dipl.spi.spi_backend.model.PaymentSplit;
import dipl.spi.spi_backend.repository.PaymentSplitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PaymentSplitService {

    @Autowired
    private PaymentSplitRepository paymentSplitRepository;

    @Autowired
    private ArticleService articleService;

    @Autowired
    private AppUserService appUserService;

    @Autowired
    private AccountService accountService;


    public List<PaymentSplitDto> getPaymentSplitsForArticle(Long articleId) {
        return paymentSplitRepository
                .findByArticleId(articleId)
                .stream()
                .map(PaymentSplitDto::new)
                .collect(Collectors.toList());
    }

    public PaymentSplitDto createPaymentSplit(PaymentSplitDto paymentSplitDto) {

        if(paymentSplitRepository
                .findByArticleIdAndAccountNumber(
                        paymentSplitDto.getArticleId(),
                        paymentSplitDto.getAccount().getNumber()
                )
                .isPresent()
        ) {
            throw new ApiBadRequestException("Payment split with account number "
                    + paymentSplitDto.getAccount().getNumber() + " has already been added to the article");
        }

        Article article = articleService.findById(paymentSplitDto.getArticleId());
        AppUser user = appUserService.findUserById(article.getUser().getId());
        Account account = null;

        // check if the account has already been saved or the user selected an existing one
        Optional<Account> accountOpt = accountService.findAccountById(paymentSplitDto.getAccount().getId());
        account = accountOpt.orElseGet(() -> new Account(paymentSplitDto.getAccount(), user));

        PaymentSplit paymentSplit = new PaymentSplit(paymentSplitDto, user, article, account);

        try {
            return new PaymentSplitDto(paymentSplitRepository.save(paymentSplit));
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        throw new ApiBadRequestException("Something went wrong. Please refresh the page and try again");
    }

    public PaymentSplitDto updatePaymentSplit(PaymentSplitDto paymentSplitDto) {

        if (paymentSplitDto.getId() == null) {
           throw new ApiBadRequestException("Failed to find payment split");
        }

        PaymentSplit paymentSplit = paymentSplitRepository
                .findById(paymentSplitDto.getId())
                .orElseThrow(() -> new ApiNotFoundException("Payment split with id "
                        + paymentSplitDto.getId() + " wasn't found"));

        paymentSplit.updateValues(paymentSplitDto);

        try {
            return new PaymentSplitDto(paymentSplitRepository.save(paymentSplit));
        } catch (Exception ex) {
            throw new ApiBadRequestException("Something went wrong. Please refresh the page and try again");
        }

    }
}